from flask import Flask, request, jsonify, render_template
import openai
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        prompt = f'''
        You are TruthSleuth, an AI-powered fake news and misinformation detector.
        Analyze the following text and determine its credibility.
        Cross-reference it conceptually using only credible global news sources such as BBC, Reuters, and Associated Press.
        Provide output in this format:
        - A credibility score (0–100)
        - Classification (e.g., "Likely True", "Unverified", "Likely False")
        - A 2–3 sentence summary
        - A short reasoning explaining why it might be true or false
        - 3 key indicators that influenced your judgment
        - 2 potential concerns or biases
        - 3 credible sources or outlets related to the topic

        Text: {text}
        '''

        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": prompt}]
        )

        result = response.choices[0].message["content"]
        return jsonify({'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
