from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Flask backend is running."
    }), 200

@app.route("/submit", methods=["POST"])
def submit_form():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "error": "A valid JSON request body is required."
        }), 400

    full_name = data.get("fullName", "")
    email = data.get("email", "")
    phone = data.get("phone", "")
    message = data.get("message", "")

    if not all(
        isinstance(value, str)
        for value in (full_name, email, phone, message)
    ):
        return jsonify({
            "status": "error",
            "error": "All form fields must contain text values."
        }), 400

    full_name = full_name.strip()
    email = email.strip()
    phone = phone.strip()
    message = message.strip()

    if not full_name or not email or not message:
        return jsonify({
            "status": "error",
            "error": "Full name, email, and message are required."
        }), 400

    if "@" not in email or email.startswith("@") or email.endswith("@"):
        return jsonify({
            "status": "error",
            "error": "Please provide a valid email address."
        }), 400

    submission = {
        "fullName": full_name,
        "email": email,
        "phone": phone,
        "message": message
    }

    print(f"Form submission processed: {submission}", flush=True)

    return jsonify({
        "status": "success",
        "message": "Data submitted successfully.",
        "data": submission
    }), 200


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )