pipeline {
    agent any
    environment {
        // Original environment variables
        VAULT_PASSWORD = 'aasmaan' // Jenkins secret for the Ansible vault password
        KUBECONFIG = './k8s/kubectl-config' // Path to Kubernetes kubeconfig file
        MINIKUBE_IP = '192.168.49.2' // Hardcoded Minikube IP
        
        // Minikube Docker environment variables
        DOCKER_TLS_VERIFY = "1"
        DOCKER_HOST = "tcp://192.168.49.2:2376" // Replace with your Minikube Docker host
        DOCKER_CERT_PATH = "/home/aasmaan/.minikube/certs" // Replace with your cert path
        MINIKUBE_ACTIVE_DOCKERD = "minikube"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning the Git repository...'
                git branch: 'spek8', url: 'https://github.com/Aasmaan007/paytm-spe2-.git'
            }
        }

        stage('Remove Existing Docker Images') {
            steps {
                echo 'Removing existing Docker images inside Minikube Docker...'
                script {
                    sh '''
                    eval $(minikube docker-env)
                    docker rmi -f aasmaan1/frontend:latest || true
                    docker rmi -f aasmaan1/backend:latest || true
                    '''
                }
            }
        }

        stage('Build Images with Docker Compose') {
            steps {
                echo 'Building images using Docker Compose in Minikube environment...'
                script {
                    sh '''
                    eval $(minikube docker-env)
                    docker-compose build
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying Frontend and Backend to Kubernetes...'
                script {
                    writeFile file: '/tmp/vault_password.txt', text: "${env.VAULT_PASSWORD}"
                    sh '''
                    eval $(minikube docker-env)
                    ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --vault-password-file /tmp/vault_password.txt
                    '''
                }
            }
        }
    }
}
