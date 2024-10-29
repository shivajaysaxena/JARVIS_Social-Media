from flask import Flask, request, render_template, redirect, url_for
import os
import glob
import subprocess
from roboflow import Roboflow

app = Flask(__name__)

# Set up your Roboflow API key and project details
rf = Roboflow(api_key="8jH2f4reQGuyuvJ5QHEg")
project = rf.workspace("huangzixuan").project("drugs-detection")
version = project.version(3)
dataset = version.download("yolov7")

# Create the uploads folder if it doesn't exist
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    
    if file.filename == '':
        return redirect(request.url)

    # Save the uploaded image
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Run the YOLOv7 detection script
    weights_path = 'runs/train/EXP_DIR/weights/best.pt'  # Update this to your actual EXP_DIR path
    subprocess.run(['python', 'detect.py', '--weights', weights_path, '--conf', '0.1', '--source', file_path])

    # Get the results
    result_images = glob.glob(f'runs/detect/exp/*.jpg')  # Update this if needed
    return render_template('results.html', images=result_images)

if __name__ == '__main__':
    app.run(debug=True)
