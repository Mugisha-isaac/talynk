import torch
import torch.nn as nn
from transformers import AutoModel, Wav2Vec2FeatureExtractor


class TalynkAudioQualityModel(nn.Module):
    def __init__(self, pretrained_model_name="m-a-p/MERT-v1-95M", num_outputs=1):
        super().__init__()
        # Load the pre-trained MERT model backbone from Hugging Face
        self.mert = AutoModel.from_pretrained(
            pretrained_model_name, trust_remote_code=True
        )
        # Freeze the backbone if you only want to fine-tune the head (saves memory/time)
        for param in self.mert.parameters():
            param.requires_grad = False

        # Classification/Regression Head for Quality Score
        self.quality_head = nn.Sequential(
            nn.Linear(self.mert.config.hidden_size, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_outputs),
            nn.Sigmoid(),  # Bound score between 0.0 and 1.0
        )

    def forward(self, input_values):
        outputs = self.mert(input_values)
        # Use mean pooling over the sequence dimension to get a single vector per audio file
        embeddings = outputs.last_hidden_state.mean(dim=1)
        score = self.quality_head(embeddings)
        return score


# Singleton instance initialization helper
def load_audio_pipeline():
    processor = Wav2Vec2FeatureExtractor.from_pretrained(
        "m-a-p/MERT-v1-95M", trust_remote_code=True
    )
    model = TalynkAudioQualityModel()
    # model.load_state_dict(torch.load("path_to_finetuned_weights.pt")) # Load weights after training
    model.eval()
    return processor, model
