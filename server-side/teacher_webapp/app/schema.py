from marshmallow import Schema, fields, ValidationError
import os


class ImageSchema(Schema):
    image = fields.Function(
        deserialize=lambda obj: obj,
        validate=lambda image: ImageSchema.validate_image(image)
    )

    def validate_image(image):
        valid_extensions = ['.jpg', '.jpeg', '.png']
        max_size = 1024 * 1024 * 3
        ext = os.path.splitext(image.name)[1].lower()

        if ext not in valid_extensions:
            raise ValidationError('Unsupported file extension')
        
        if image.size > max_size:
            raise ValidationError('File size must be no more than 3MB')
        
        return image
