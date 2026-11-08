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

## Docker and CI services

The Compose stack runs the portfolio on port 5000, Jenkins on port 8080, and SonarQube on port 9000. Jenkins and SonarQube keep their state in named volumes. They share the `devops-ci-cd-network` bridge network so Jenkins can reach SonarQube by the service name `sonarqube`.

On an Ubuntu/Debian Linux host, install Docker Engine and the Compose plugin with the included script:

```bash
sudo bash scripts/install-docker.sh
```

This changes host packages and group membership. In GitHub Codespaces, first check whether Docker is already available; the script is intended for a Linux machine you administer, not for running blindly inside a Codespace.

Start the services from this repository:

```bash
DOCKER_GID="$(stat -c '%g' /var/run/docker.sock)" docker compose up --build -d
```

The Jenkins container uses the host Docker socket to build the portfolio image. This grants Jenkins control over the host Docker daemon, so use this local lab only with trusted pipeline code.

On first start, retrieve Jenkins' unlock password with `docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`, then finish the setup wizard at http://localhost:8080. Open SonarQube at http://localhost:9000, change the initial `admin` password, and create a user token. In Jenkins, add that token as a **Secret text** credential with ID `sonarqube-token`. Create a Pipeline job using **Pipeline script from SCM**, select Git, and enter this repository's URL and branch so `checkout scm` can find the `Jenkinsfile`.

For SonarQube on Linux, set the host kernel value required by Elasticsearch before starting the stack:

```bash
sudo sysctl -w vm.max_map_count=262144
```

To stop the stack without deleting persistent data:

```bash
docker compose down
```

To also delete Jenkins and SonarQube data, explicitly remove the named volumes with `docker compose down -v`.

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