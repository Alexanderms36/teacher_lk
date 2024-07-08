from marshmallow import Schema, fields, ValidationError
from django.core.files.uploadedfile import InMemoryUploadedFile
import os


class ImageSchema(Schema):
    image = fields.Function(
        deserialize=lambda obj: obj,
        validate=lambda image: ImageSchema.validate_image(image)
    )

    def validate_image(image):
        max_size = 1024 * 1024 * 3
        valid_extensions = ['.jpg', '.jpeg', '.png']

        if image.size > max_size:
            raise ValidationError('File size must be no more than 3MB')

        ext = os.path.splitext(image.name)[1].lower()
        if ext not in valid_extensions:
            raise ValidationError('Unsupported file extension')
        
        return image
