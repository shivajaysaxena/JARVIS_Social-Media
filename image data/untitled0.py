# -*- coding: utf-8 -*-
"""Untitled0.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/12XHfsXX9Awkx5rQpQ4UjXBmfDHzNuOVd
"""

!pip install roboflow

from roboflow import Roboflow
rf = Roboflow(api_key="8jH2f4reQGuyuvJ5QHEg")
project = rf.workspace("huangzixuan").project("drugs-detection")
version = project.version(3)
dataset = version.download("yolov7")

# Commented out IPython magic to ensure Python compatibility.
# # Create the directory if it doesn't exist
# !mkdir -p /content/yolov7
# # Change to the /content/yolov7 directory
# %cd /content/yolov7
# # Download the COCO starting checkpoint for YOLOv7
# !wget "https://github.com/WongKinYiu/yolov7/releases/download/v0.1/yolov7.pt
# %cd /content
!git clone https://github.com/WongKinYiu/yolov7.git

# Commented out IPython magic to ensure Python compatibility.
# %cd /content/yolov7
!python train.py --batch 8 --cfg cfg/training/yolov7.yaml --epochs 30 --data {dataset.location}/data.yaml --weights 'yolov7.pt' --device 0

import os

# List all experiment directories
print("Experiment Directories:", os.listdir("runs/train"))

# Get the most recent experiment directory by sorting by modification time
exp_dirs = [d for d in os.listdir("runs/train") if os.path.isdir(os.path.join("runs/train", d))]
EXP_DIR = max(exp_dirs, key=lambda d: os.path.getmtime(os.path.join("runs/train", d)))

# Verify if 'best.pt' exists
exp_path = os.path.join("runs/train", EXP_DIR, "weights")
print("Weights Directory:", exp_path)
print("Contents:", os.listdir(exp_path))

# Check if best.pt exists before running detection
weights_path = os.path.join(exp_path, "best.pt")
if os.path.exists(weights_path):
    # Run detection
    !python detect.py --weights {weights_path} --conf 0.1 --source {dataset.location}/test/images
else:
    print("Weights file 'best.pt' does not exist.")

HOME = "/content"
import os
import glob
from IPython.display import Image, display

# Set HOME path
HOME = "/content"

# Get the directory containing the most recent detection run
EXP_DIR = sorted(os.listdir("runs/detect"), key=lambda x: int(x.replace("exp", "") or 0))[-1]

i = 0
limit = 10000  # max images to display
for imageName in glob.glob(f"{HOME}/yolov7/runs/detect/{EXP_DIR}/*.jpg"):  # assuming JPG format
    if i < limit:
        display(Image(filename=imageName))
        print("\n")
    i += 1