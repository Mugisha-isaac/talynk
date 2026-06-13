import os
import torch
import torch.nn as nn
from transformers import CLIPVisionModel, CLIPProcessor, logging

logging.set_verbosity_error()


class NimaClipQualityModel(nn.Module):
    def __init__(self, pretrained_clip="openai/clip-vit-base-patch32"):
        super().__init__()
        self.clip_vision = CLIPVisionModel.from_pretrained(pretrained_clip)
        for param in self.clip_vision.parameters():
            param.requires_grad = False

        self.nima_head = nn.Sequential(
            nn.Linear(self.clip_vision.config.hidden_size, 212),
            nn.ReLU(),
            nn.Linear(212, 10),
            nn.Softmax(dim=-1),
        )

    def forward(self, pixel_values):
        outputs = self.clip_vision(pixel_values=pixel_values)
        image_embeds = outputs.pooler_output
        probabilities = self.nima_head(image_embeds)

        score_distribution_scale = torch.arange(1, 11, dtype=torch.float32).to(
            pixel_values.device
        )
        expected_aesthetic_score = torch.sum(
            probabilities * score_distribution_scale, dim=-1
        )
        return expected_aesthetic_score / 10.0


def load_visual_pipeline():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    model = NimaClipQualityModel()

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

    model.to(device)
    model.eval()
    return processor, model
