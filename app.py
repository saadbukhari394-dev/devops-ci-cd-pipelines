import os

from flask import Flask, jsonify, render_template

app = Flask(__name__)

PROJECTS = [
    {
        "title": "Pipeline in a box",
        "category": "DevOps",
        "eyebrow": "CI / CD LAB",
        "description": "A small, repeatable delivery path from a Git commit to a container image.",
        "details": "This sample workflow connects a declarative Jenkins pipeline, a SonarQube quality scan, and a Docker build. It is designed to make each delivery step visible and easy to reproduce.",
        "stack": ["Jenkins", "SonarQube", "Docker"],
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
        "image_alt": "Server racks in a data center",
    },
    {
        "title": "Service pulse",
        "category": "Backend",
        "eyebrow": "FLASK / PYTHON",
        "description": "A lightweight web service with a clear health endpoint and a production-ready container.",
        "details": "The portfolio itself is a small Flask application. It separates presentation from application code, exposes a health route for container checks, and runs behind Gunicorn in its Docker image.",
        "stack": ["Python", "Flask", "Gunicorn"],
        "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
        "image_alt": "Laptop displaying a software development workspace",
    },
    {
        "title": "Cloud notes",
        "category": "Cloud",
        "eyebrow": "CONTAINER DESIGN",
        "description": "A practical deployment sketch focused on simple networking, persistent data, and clear operations.",
        "details": "This lab models the day-two details that make a local stack useful: named volumes for state, a dedicated bridge network for service discovery, and documented start and teardown commands.",
        "stack": ["Docker Compose", "Networking", "Volumes"],
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
        "image_alt": "Close-up of a detailed electronic circuit board",
    },
]


@app.get("/")
def index():
    return render_template(
        "index.html",
        projects=PROJECTS,
        contact_email=os.getenv("CONTACT_EMAIL", "").strip(),
    )


@app.get("/health")
def health():
    return jsonify(status="ok", service="saad-hassan-portfolio")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=False)