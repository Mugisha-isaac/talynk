import os
import torch
import torch.nn as nn
from transformers import CLIPVisionModel, CLIPProcessor, logging

# Suppress text-encoder unexpected weight warnings
logging.set_verbosity_error()


class NimaClipQualityModel(nn.Module):
    def __init__(self, pretrained_clip="openai/clip-vit-base-patch32"):
        super().__init__()
        # Initialize only the visual tower sub-component of CLIP
        self.clip_vision = CLIPVisionModel.from_pretrained(pretrained_clip)

        # Freeze visual backbone weights to avoid optimization degradation during inference
        for param in self.clip_vision.parameters():
            param.requires_grad = False

        # The aesthetics score scoring architecture matching your AADB fine-tuning layer
        self.nima_head = nn.Sequential(
            nn.Linear(self.clip_vision.config.hidden_size, 212),
            nn.ReLU(),
            nn.Linear(
                212, 10
            ),  # Generates score probability metrics for bins 1 through 10
            nn.Softmax(dim=-1),
        )

    def forward(self, pixel_values):
        outputs = self.clip_vision(pixel_values=pixel_values)
        image_embeds = outputs.pooler_output  # Extract the global vision vector

        # Run forward pass through the classification head to get probability distributions
        probabilities = self.nima_head(image_embeds)

        # Multiply distributions by scalar score indices to find the expected mean value
        score_distribution_scale = torch.arange(1, 11, dtype=torch.float32).to(
            pixel_values.device
        )
        expected_aesthetic_score = torch.sum(
            probabilities * score_distribution_scale, dim=-1
        )

        # Normalize the expected 1-10 value scale down to a 0.0 - 1.0 bounding range
        return expected_aesthetic_score / 10.0


def load_visual_pipeline():
    """
    Initializes and aggregates the CLIP preprocessor image utility functions with
    the fine-tuned aesthetic matrix.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"-> Visual Quality Pipeline: Target environment mapped to {device}")

    # 1. Instantiate the input image pixel preprocessor transformer
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    # 2. Instantiate the wrapper model skeleton
    model = NimaClipQualityModel()

    # 3. Apply the custom weights saved from your zipped Colab export run
    weights_path = os.path.join(
        os.path.dirname(__file__), "weights", "nima_clip_head.pt"
    )

    if os.path.exists(weights_path):
        model.nima_head.load_state_dict(torch.load(weights_path, map_location=device))
        print("   [✔] Successfully loaded fine-tuned 'nima_clip_head.pt' state dict.")
    else:
        print(
            "   [!] WARNING: 'nima_clip_head.pt' not found. Operating with randomized head weights."
        )

    # Bind state structures to host system resources and flag for evaluation mode
    model.to(device)
    model.eval()

    return processor, model
