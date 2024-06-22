from django.db import models
from django.urls import reverse


# class MyModelName(models.Model):
#     """A typical class defining a model, derived from the Model class."""

#     name = models.CharField(max_length=20, help_text='Enter field documentation')

#     class Meta:
#         ordering = ['-my_field_name']

#     def get_absolute_url(self):
#         """Returns the URL to access a particular instance of MyModelName."""
#         return reverse('model-detail-view', args=[str(self.id)])

#     def __str__(self):
#         """String for representing the MyModelName object (in Admin site etc.)."""
#         return self.name
    
# # Create a new record using the model's constructor.
# a_record = MyModelName(name="Instance #1")

# # Save the object into the database.
# a_record.save()