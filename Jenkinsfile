pipeline {
    environment {
        VAULT_PASSWORD = 'aasmaan' // Jenkins secret for Ansible vault password
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

        // Remove existing Docker images
        stage('Remove Existing Docker Images') {
            steps {
                echo 'Removing existing Docker images (aasmaan1/frontend and aasmaan1/backend)...'
                script {
                    // Remove existing frontend and backend images if they exist
                    sh 'docker rmi -f aasmaan1/frontend:latest || true'
                    sh 'docker rmi -f aasmaan1/backend:latest || true'
                }
            }
        }

        // Build Docker images using Docker Compose
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images using Docker Compose...'
                script {
                    // Build images for both frontend and backend using Docker Compose
                    sh 'docker-compose -f docker-compose.yml build'
                }
            }
        }

        // Push Backend Docker image to Docker Hub
        stage('Push Backend Docker Image') {
            steps {
                echo 'Pushing Backend Docker image to Docker Hub...'
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        sh 'docker push aasmaan1/backend:latest'
                    }
                }
            }
        }

        // Push Frontend Docker image to Docker Hub
        stage('Push Frontend Docker Image') {
            steps {
                echo 'Pushing Frontend Docker image to Docker Hub...'
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        sh 'docker push aasmaan1/frontend:latest'
                    }
                }
            }
        }

        // Deploy Backend to Kubernetes using Ansible
        stage('Deploy Backend to Kubernetes') {
            steps {
                echo 'Deploying Backend to Kubernetes using Ansible...'
                script {
                    // Run Ansible playbook to deploy backend
                    sh 'ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --extra-vars "deployment=backend"'
                }
            }
        }

        // Deploy Frontend to Kubernetes using Ansible
        stage('Deploy Frontend to Kubernetes') {
            steps {
                echo 'Deploying Frontend to Kubernetes using Ansible...'
                script {
                    // Run Ansible playbook to deploy frontend
                    sh 'ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --extra-vars "deployment=frontend"'
                }
            }
        }
    }
}
