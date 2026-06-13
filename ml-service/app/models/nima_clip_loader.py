import torch
import torch.nn as nn
from transformers import CLIPVisionModel, CLIPProcessor


class NimaClipQualityModel(nn.Module):
    def __init__(self, pretrained_clip="openai/clip-vit-base-patch32"):
        super().__init__()
        # Alternatively use a ResNet-50 backbone directly or CLIP's vision tower
        self.clip_vision = CLIPVisionModel.from_pretrained(pretrained_clip)

        # NIMA head predicts a distribution over scores (1 to 10) to compute an aesthetic mean
        self.nima_head = nn.Sequential(
            nn.Linear(self.clip_vision.config.hidden_size, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 10),
            nn.Softmax(dim=-1),
        )

    def forward(self, pixel_values):
        outputs = self.clip_vision(pixel_values=pixel_values)
        image_embeds = outputs.pooler_output  # Global visual vector
        probabilities = self.nima_head(image_embeds)

        # Calculate the expected mean value (Aesthetic Quality Score)
        scores = torch.arange(1, 11, dtype=torch.float32).to(pixel_values.device)
        mean_score = torch.sum(probabilities * scores, dim=-1)
        return mean_score / 10.0  # Normalize to 0.0 - 1.0 range


def load_visual_pipeline():
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    model = NimaClipQualityModel()
    model.eval()
    return processor, model
