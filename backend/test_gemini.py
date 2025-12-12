import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Get API key
api_key = os.getenv('GEMINI_API_KEY')

print("="*60)
print("🧪 TESTING GEMINI API")
print("="*60)

# Check if API key exists
if not api_key:
    print("❌ ERROR: GEMINI_API_KEY not found in .env file!")
    print("\n📝 Steps to fix:")
    print("1. Get API key from: https://makersuite.google.com/app/apikey")
    print("2. Add to .env file: GEMINI_API_KEY=your_key_here")
    exit()

print(f"✅ API Key found: {api_key[:20]}...")

# Try to configure and use Gemini
try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    print("\n🔄 Testing Gemini API...")
    
    # Simple test
    response = model.generate_content("Say 'Hello, I'm working!' in one sentence.")
    
    print(f"\n✅ SUCCESS! Gemini is working!")
    print(f"\n📝 Response: {response.text}")
    print("\n" + "="*60)
    print("✅ Gemini API is configured correctly!")
    print("="*60)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\n🔍 Possible issues:")
    print("1. Invalid API key")
    print("2. API key expired")
    print("3. Quota exceeded")
    print("4. Internet connection problem")
    print("\n💡 Try:")
    print("- Generate new API key")
    print("- Check your Google Cloud quota")
    print("- Verify internet connection")