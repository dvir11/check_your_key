"""
Django settings example file with sensitive variables
"""

import os
from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-key-should-not-be-here'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',  # Sensitive!
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# API Keys
STRIPE_API_KEY = 'sk_test_abcdefghijklmnopqrstuvwxyz'
GOOGLE_MAPS_API_KEY = 'AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE'

# AWS Configuration
AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE'
AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'

# JWT Token settings
JWT_SECRET_KEY = 'jwt-secret-key-should-be-in-env'
JWT_PRIVATE_KEY = '''
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA04up8hoqzS8SYQr2yNjVNNZ7UU3c8i1OtGjyQkjkZftILxwZ
7uG9v9jKkSF7DYTtY9bXRU/8cKkH6M1J5uyGQgQfaUHUqzP0tIGRUCvKdQH4ihEP
TKcJJL+oqYs6dD4xvgJNs3mwYABPJBLQJJjXfRPdHIHsUJmP0rjsLxJpnCkd2GdW
Ad2YMYz4teyJdq0SVnN+lgQYnZyIuCDtZXXVQyQGxBirhQHwFKGOlmDQHmqRyQPi
tUw2jAjDXgMNyZqOc5Iw/H7cxHmxzOSJORkAVsHFqKJJ5T0hHRMoLIHnB4Iy7tI7
EJXNV5xjKJl7GYN0+KjR0uJaF9aYmRSRmUwQ2QIDAQABAoIBAQCu0tMxPNE5QH5M
KfAIw0qv5Pmn5zmSNGqV5Ox1Lr9aW9Z7nqjNAbXZ9qYVeBYE1YCTlZLBuFW0nBfJ
Yk1P9PgJZmhvz8+UZVuKQXlCNKGx8p0tNAz7zLaDbVaQXJCeGZVm3a8ZQgSJ/Nqz
GsQgYeYxFzLgyYMAjHPbkIxmvGDxiMXkEMtKdONxvkNZdRmzQ4e5+ZL6I5f4+5Bz
jHnhfNAK/KfTbVSk+3h5+L0dZ9hTmgxwb8JmLKbLtBsYiNbibPcIYYIyJO9Z1LVi
B9VC5Jxww9MEGzJZS7jaqxTQQUDKOjyGQIwUBE9yLJM8RG4ncmx/HYXDkRTZlQRJ
bkLBIQDBAoGBAO/ehgKNLMVQJV0gGzb7+OG9PmA6RuKrWY9a4VyKGLix3Gj6zQv/
cDb4H7+7DAFQK+KP0/Z1MXXGvnzcUsmkEqKdpJJzqMBQQrSPjHZLGkDVNoJHBWBE
4JKERbV7P7jJlz4KCxbBNHfMYwzrfZwPJD/1CsUCZ2IttZYYjE4LnhyFAoGBAOHU
aBQXpRtH5hCrj8S7xSYGrO1klnvnrqMJ7wlUULRqh8DYhTRKQtBpvY1G0V3XzjOG
nxjNDgU9OU5SWXadYXAcxA+IQj/XYJ4jXCA6Z0KQPPwbTAMXYQWl/mUMGHEzlbLO
AZ4ZZPHRs0XtEVY1+/yMR9uDcQ0/iYI7xSXBnSrVAoGAQJXcR/yMJ3+eLWO/vUYA
JkIKLGcrkWnEQWfExcXDJ8z3D4+E6qPxHEWe0fBDcnaVKEwHzgYBkMBs3XaQKVxk
c5ZV4jMXK0pgm8QQshrJtHtjEECJTDCWHbzejf7rN0oqIdVV4n9t9wMa8GzA7uXQ
Xm1YXjBwLWBIwERn2WoPPekCgYEAhJL0A8SvzjbXlNHbvprKcfYCbQSgmZF7/6Ks
9uOFnABjNwNIMWCt8Z7GMQ7P7l3Vn4Kw7vZ307Iim0+nVrOYUPxEQFQQZRjkWUHP
QZzKEfOPXUzJhOvq6uDN/YyBpKALqEpmJdQgBKILESBCQIgUYkfNtGK5h8MwzPKS
dAjSVoUCgYBuTDycBKrX2RDFJm/8UZEqK3KB9iBK+HFBqnqQ4nnTmOcvf3RMj5K8
QKbpwdX6Z8YEoGP2kUKkEFBP1QQPTYdvR/RbNKQO0Cd5NcZLdZJMJTbKFZpwkfPx
HrU3c1S2MlZdgPy7kUYCZFxUmYKbYEjgMLKH3v2gJZ2N3RYNJGbOcA==
-----END RSA PRIVATE KEY-----
'''

# Email settings
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'myapp@gmail.com'
EMAIL_HOST_PASSWORD = 'email-password-here'  # Sensitive!

# Debug settings
DEBUG_MODE = True  # Should be False in production

# Allow all hosts in development
ALLOWED_HOSTS = ['*']

# The proper way to handle sensitive information
# SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
# DEBUG = os.environ.get('DEBUG', 'False') == 'True'
# EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')
# AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')