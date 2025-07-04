import os
import json
import numpy as np
import cv2
import seaborn as sns
import matplotlib.pyplot as plt

from tensorflow.keras.applications import MobileNetV2 
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input  
from tensorflow.keras.models import Model  
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D  
from tensorflow.keras.utils import to_categorical  
from tensorflow.keras.preprocessing.image import ImageDataGenerator  
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint 

from sklearn.metrics import confusion_matrix, classification_report 


# -------------------------------
# Load image data
# -------------------------------
def load_data(data_dir: str):
    images = []
    labels = []
    for label in os.listdir(data_dir):
        label_folder = os.path.join(data_dir, label)
        for filename in os.listdir(label_folder):
            img_path = os.path.join(label_folder, filename)
            img = cv2.imread(img_path)
            if img is not None:
                img = cv2.resize(img, (224, 224))
                img = preprocess_input(img.astype(np.float32))
                images.append(img)
                labels.append(label)
    return np.array(images), np.array(labels)


train_images, train_labels_raw = load_data('../dataset/train')
val_images, val_labels_raw = load_data('../dataset/val')

# -------------------------------
# Encode labels
# -------------------------------
label_mapping = {label: idx for idx, label in enumerate(sorted(set(train_labels_raw)))}

train_labels = np.array([label_mapping[label] for label in train_labels_raw])
val_labels = np.array([label_mapping[label] for label in val_labels_raw])

num_classes = len(label_mapping)
train_labels = to_categorical(train_labels, num_classes)
val_labels = to_categorical(val_labels, num_classes)

# -------------------------------
# Data augmentation
# -------------------------------
train_aug = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True
)
val_aug = ImageDataGenerator(preprocessing_function=preprocess_input)

train_gen = train_aug.flow(train_images, train_labels, batch_size=32)
val_gen = val_aug.flow(val_images, val_labels, batch_size=32)

# -------------------------------
# Build model
# -------------------------------
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
for layer in base_model.layers:
    layer.trainable = False  # Freeze layers before compile

x = base_model.output
x = GlobalAveragePooling2D()(x)
predictions = Dense(num_classes, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# -------------------------------
# Train model
# -------------------------------
callbacks = [
    EarlyStopping(patience=3, restore_best_weights=True),
    ModelCheckpoint('best_model.keras', save_best_only=True)
]

model.fit(train_gen, validation_data=val_gen, epochs=10, callbacks=callbacks)

# -------------------------------
# Evaluate model
# -------------------------------
val_preds = model.predict(val_gen, steps=val_gen.n // val_gen.batch_size + 1)
val_pred_labels = np.argmax(val_preds, axis=1)
true_labels = np.argmax(val_labels, axis=1)

# Classification report
print(classification_report(true_labels, val_pred_labels, target_names=label_mapping.keys()))

# Confusion matrix
cm = confusion_matrix(true_labels, val_pred_labels)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=label_mapping.keys(),
            yticklabels=label_mapping.keys())
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
plt.show()

# -------------------------------
# Save model and label map
# -------------------------------
model.save('location_identifier_model.keras')
with open("label_mapping.json", "w") as f:
    json.dump(label_mapping, f)
