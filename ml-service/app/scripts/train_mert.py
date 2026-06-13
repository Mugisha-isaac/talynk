import torch
from torch.utils.data import DataLoader, Dataset
from app.models.mert_loader import TalynkAudioQualityModel


class AudioDataset(Dataset):
    def __init__(self, audio_tensors, labels):
        self.audio_tensors = audio_tensors  # Extracted feature vectors from Wav2Vec2
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return self.audio_tensors[idx], torch.tensor(
            [self.labels[idx]], dtype=torch.float32
        )


def train_mert_quality(dataset, epochs=3):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = TalynkAudioQualityModel().to(device)
    model.train()  # Set head to training, backbone remains frozen/unfrozen based on definition

    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    optimizer = torch.optim.AdamW(model.quality_head.parameters(), lr=1e-4)
    criterion = torch.nn.MSELoss()

    for epoch in range(epochs):
        for inputs, targets in dataloader:
            inputs, targets = inputs.to(device), targets.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
        print(f"Epoch {epoch+1} Complete. Loss: {loss.item()}")

    torch.save(model.state_dict(), "app/models/weights/mert_finetuned.pt")
