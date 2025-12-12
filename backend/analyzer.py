from transformers import pipeline
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Hugging Face sentiment analyzer
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Initialize Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
# Use the latest stable model from list
gemini_model = genai.GenerativeModel('gemini-2.5-flash')

def analyze_sentiment(text):
    """
    Analyze sentiment using Hugging Face transformers
    Returns: dict with sentiment and score
    """
    try:
        result = sentiment_analyzer(text[:512])[0]  # Limit to 512 chars for model
        
        # Convert to our format
        label = result['label'].lower()
        score = result['score']
        
        # Improved logic with stricter thresholds
        # Model only outputs POSITIVE or NEGATIVE, never neutral
        # So we use confidence score to determine neutral
        
        if score < 0.70:
            # Low confidence = neutral (model not sure)
            sentiment = 'neutral'
        elif label == 'positive':
            sentiment = 'positive'
        elif label == 'negative':
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
            
        return {
            'sentiment': sentiment,
            'score': score
        }
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return {
            'sentiment': 'neutral',
            'score': 0.5
        }

def extract_key_points(text):
    """
    Extract key points using Gemini AI
    Returns: string with key points
    """
    try:
        prompt = f"""Analyze this product review and extract 3-5 key points in bullet format.
Be concise and focus on the most important aspects mentioned.

Review: {text}

Key Points:"""
        
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        error_msg = str(e)
        print(f"Error in key points extraction: {error_msg}")
        
        # More detailed error message
        if "API_KEY" in error_msg.upper():
            return "⚠️ Gemini API key not configured. Please add GEMINI_API_KEY to .env file."
        elif "QUOTA" in error_msg.upper():
            return "⚠️ API quota exceeded. Please try again later."
        else:
            return f"⚠️ Unable to extract key points: {error_msg}"

def analyze_review(review_text):
    """
    Complete review analysis combining both AI services
    """
    sentiment_result = analyze_sentiment(review_text)
    key_points = extract_key_points(review_text)
    
    return {
        'sentiment': sentiment_result['sentiment'],
        'sentiment_score': sentiment_result['score'],
        'key_points': key_points
    }