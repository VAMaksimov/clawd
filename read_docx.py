#!/usr/bin/env python3
import sys
import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    """Extract text from a .docx file"""
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')
        
        # Parse XML
        root = ET.fromstring(xml_content)
        
        # Define namespace
        namespaces = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        }
        
        # Extract all text nodes
        text_elements = root.findall('.//w:t', namespaces)
        text_content = ''.join([elem.text for elem in text_elements if elem.text])
        
        return text_content
    except Exception as e:
        return f"Error reading file: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 read_docx.py <docx_file>")
        sys.exit(1)
    
    docx_file = sys.argv[1]
    text = extract_text_from_docx(docx_file)
    print(text)
