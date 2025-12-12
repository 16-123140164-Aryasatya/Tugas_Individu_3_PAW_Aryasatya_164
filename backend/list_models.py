import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("❌ GEMINI_API_KEY not found!")
    exit()

print("="*60)
print("🔍 LISTING AVAILABLE GEMINI MODELS")
print("="*60)
print(f"✅ API Key: {api_key[:20]}...")
print()

try:
    genai.configure(api_key=api_key)
    
    print("📋 Available models that support generateContent:\n")
    
    count = 0
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            count += 1
            print(f"{count}. {model.name}")
            print(f"   Display Name: {model.display_name}")
            print(f"   Description: {model.description[:100]}...")
            print()
    
    if count == 0:
        print("❌ No models found!")
        print("\n💡 Possible solutions:")
        print("1. Update library: pip install --upgrade google-generativeai")
        print("2. Check API key is valid")
        print("3. Verify internet connection")
    else:
        print("="*60)
        print(f"✅ Found {count} available models")
        print("="*60)
        
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    print("\n💡 Try:")
    print("pip install --upgrade google-generativeai")