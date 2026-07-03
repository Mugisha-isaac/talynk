import os
import torch
import torch.nn as nn
from transformers import AutoModel, Wav2Vec2FeatureExtractor, logging

logging.set_verbosity_error()


class TalynkAudioQualityModel(nn.Module):
    def __init__(self, pretrained_model_name="m-a-p/MERT-v1-95M"):
        super().__init__()
        self.mert = AutoModel.from_pretrained(
            pretrained_model_name, trust_remote_code=True
        )
        for param in self.mert.parameters():
            param.requires_grad = False

        self.quality_head = nn.Sequential(
            nn.Linear(self.mert.config.hidden_size, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid(),
        )

    def forward(self, input_values):
        outputs = self.mert(input_values)
        embeddings = outputs.last_hidden_state.mean(dim=1)
        return self.quality_head(embeddings)


def load_audio_pipeline():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    processor = Wav2Vec2FeatureExtractor.from_pretrained(
        "m-a-p/MERT-v1-95M", trust_remote_code=True
    )
    model = TalynkAudioQualityModel()

    weights_path = os.path.join(
        os.path.dirname(__file__), "weights", "mert_quality_head.pt"
    )
    if os.path.exists(weights_path):
        model.quality_head.load_state_dict(
            torch.load(weights_path, map_location=device)
        )
        print(
            "   [✔] Successfully loaded fine-tuned 'mert_quality_head.pt' state dict."
        )
    else:
        print(
            "   [!] WARNING: 'mert_quality_head.pt' not found. Operating with randomized head weights."
        )

    model.to(device)
    model.eval()
    return processor, model
