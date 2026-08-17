import os
import sys

project = 'Distributed Real-Time Collaboration Platform'
copyright = '2026, Divyansh Gupta'
author = 'Divyansh Gupta'
release = '1.0.0'

extensions = [
    'myst_parser',
    'sphinx_rtd_theme',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store', '.venv']

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
