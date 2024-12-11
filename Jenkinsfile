pipeline {
    environment {
        VAULT_PASSWORD = 'aasmaan' // Jenkins secret for the Ansible vault password
        KUBECONFIG = './k8s/kubectl-config' // Path to Kubernetes kubeconfig file
        MINIKUBE_IP = '192.168.49.2' // Hardcoded Minikube IP
    }

    agent any

    stages {
        // Clone the repository
        stage('Clone Repository') {
            steps {
                echo 'Cloning the Git repository...'
                git branch: 'spek8', url: 'https://github.com/Aasmaan007/paytm-spe2-.git'
            }
        }

        // Build Docker image for the backend
        stage('Build Backend Docker Image') {
            steps {
                echo 'Building Backend Docker image...'
                script {
                    backend_image = docker.build("aasmaan1/backend:latest", "./backend")
                }
            }
        }

        // Push Backend Docker image to Docker Hub
        stage('Push Backend Docker Image') {
            steps {
                echo 'Pushing Backend Docker image to Docker Hub...'
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        backend_image.push()
                    }
                }
            }
        }

        // Build Docker image for the frontend and pass backend URL at build time
        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building Frontend Docker image...'
                script {
                    frontend_image = docker.build("aasmaan1/frontend:latest", "./frontend")
                }
            }
        }

        // Push Frontend Docker image to Docker Hub
        stage('Push Frontend Docker Image') {
            steps {
                echo 'Pushing Frontend Docker image to Docker Hub...'
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        frontend_image.push()
                    }
                }
            }
        }

        // Deploy both Frontend and Backend to Kubernetes using Ansible playbook
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying Frontend and Backend to Kubernetes...'
                script {
                    sh 'ansible-playbook -i ansible/inventory.ini ansible/playbook.yml'
                }
            }
        }
    }
}
