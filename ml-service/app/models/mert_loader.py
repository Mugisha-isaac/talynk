import os
import torch
import torch.nn as nn
from transformers import AutoModel, Wav2Vec2FeatureExtractor, logging

# Suppress unexpected/missing parameter logs on instantiation
logging.set_verbosity_error()


class TalynkAudioQualityModel(nn.Module):
    def __init__(self, pretrained_model_name="m-a-p/MERT-v1-95M"):
        super().__init__()
        # Load the base transformer audio model from Hugging Face Hub
        self.mert = AutoModel.from_pretrained(
            pretrained_model_name, trust_remote_code=True
        )

        # Keep the heavy audio encoder layers frozen during inference
        for param in self.mert.parameters():
            param.requires_grad = False

        # The custom prediction block trained in Google Colab
        self.quality_head = nn.Sequential(
            nn.Linear(self.mert.config.hidden_size, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid(),  # Guarantees quality outputs fit within a 0.0 to 1.0 boundary
        )

    def forward(self, input_values):
        outputs = self.mert(input_values)
        # Average embeddings across the time/sequence dimension (Global Mean Pooling)
        embeddings = outputs.last_hidden_state.mean(dim=1)
        return self.quality_head(embeddings)


def load_audio_pipeline():
    """
    Initializes and aggregates the feature extractor processor and fine-tuned model
    state variables for real-time inference execution.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"-> Audio Quality Pipeline: Target environment mapped to {device}")

    # 1. Instantiate the official audio token preprocessor
    processor = Wav2Vec2FeatureExtractor.from_pretrained(
        "m-a-p/MERT-v1-95M", trust_remote_code=True
    )

    # 2. Instantiate the wrapper model skeleton
    model = TalynkAudioQualityModel()

    # 3. Apply the custom weights saved from your zipped Colab export run
    weights_path = os.path.join(
        os.path.dirname(__file__), "weights", "mert_quality_head.pt"
    )

    if os.path.exists(weights_path):
        # map_location ensures stability when reading GPU-saved tensors onto CPU nodes
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

    # Bind state structures to host system resources and flag for evaluation mode
    model.to(device)
    model.eval()

    return processor, model
