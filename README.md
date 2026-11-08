# Saad Hassan | Portfolio + CI/CD Lab

A responsive Flask portfolio and local CI/CD lab using Docker Compose, Jenkins, and SonarQube. The project examples are starter content; replace them with your own work and contact details before publishing.

## Run the portfolio

Requirements: Python 3.10+ and pip.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app app run --debug
```

Open http://127.0.0.1:5000. The `/health` endpoint returns a small JSON health response.

## Build the Docker and CI stack

The Compose stack runs the portfolio on port 5000, Jenkins on port 8080, and SonarQube on port 9000. Jenkins and SonarQube state is stored in named volumes. All three services share the `devops-ci-cd-network` bridge network; Jenkins reaches SonarQube at `http://sonarqube:9000`.

1. Verify Docker and Compose are available:

	```bash
	docker --version
	docker compose version
	```

	GitHub Codespaces often already has Docker available. On an Ubuntu/Debian host without Docker, run `sudo bash scripts/install-docker.sh`. The script installs host packages and enables the Docker service; do not run it blindly inside a Codespace.

2. Before starting SonarQube on Linux, set its required Elasticsearch kernel value:

	```bash
	sudo sysctl -w vm.max_map_count=262144
	```

3. From the repository directory, build and start the services:

	```bash
	export DOCKER_GID="$(stat -c '%g' /var/run/docker.sock)"
	docker compose up --build -d
	docker compose ps
	```

4. Open the portfolio at http://localhost:5000, Jenkins at http://localhost:8080, and SonarQube at http://localhost:9000. Check the portfolio health endpoint at http://localhost:5000/health.

5. On first start, retrieve Jenkins' unlock password with:

	```bash
	docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
	```

	Finish the Jenkins setup wizard. In SonarQube, change the initial `admin` password and create a user token. Add the token in Jenkins as a **Secret text** credential with ID `sonarqube-token`.

6. In Jenkins, create a Pipeline job using **Pipeline script from SCM**. Select Git, enter the repository URL, and set the branch to `feature/saad-flask-portfolio` (or the branch you want to build). Jenkins reads `Jenkinsfile`, which checks out the selected source, runs unit tests, analyzes it with SonarQube, and builds `saad-hassan-portfolio` Docker images.

	The Jenkins container mounts the host Docker socket so it can build images. This gives Jenkins control of the host Docker daemon; use this local lab only with trusted pipeline code.

7. Stop the services while retaining their data:

	```bash
	docker compose down
	```

	To delete Jenkins and SonarQube state as well, run `docker compose down -v`.

## Sample checks

```bash
python3 -m unittest discover -s tests -v
docker compose config -q
```

## Git workflow

Create a feature branch for your changes, then commit the project:

```bash
git switch -c feature/saad-flask-portfolio
git add .
git commit -m "Build Saad Hassan Flask portfolio and CI lab"
```