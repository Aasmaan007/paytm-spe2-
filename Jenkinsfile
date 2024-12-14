pipeline {
    environment {
        VAULT_PASSWORD = 'aasmaan'
        KUBECONFIG = './k8s/kubectl-config'
        MINIKUBE_IP = '192.168.49.2'
    }

    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning the Git repository...'
                git branch: 'spek8', url: 'https://github.com/Aasmaan007/paytm-spe2-.git'
            }
        }

        stage('Remove Existing Docker Images') {
            steps {
                echo 'Removing existing Docker images if any...'
                script {
                    sh 'docker rmi -f aasmaan1/frontend || true'
                    sh 'docker rmi -f aasmaan1/backend || true'
                }
            }
        }

        stage('Build Backend Docker Image in Minikube') {
            steps {
                echo 'Building Backend Docker image in Minikube...'
                script {
                    sh 'eval $(minikube docker-env)'
                    backend_image = docker.build("aasmaan1/backend:latest", "./backend")
                }
            }
        }

        stage('Build Frontend Docker Image in Minikube') {
            steps {
                echo 'Building Frontend Docker image in Minikube...'
                script {
                    sh 'eval $(minikube docker-env)'
                    frontend_image = docker.build("aasmaan1/frontend:latest", "./frontend")
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying Frontend and Backend to Kubernetes...'
                script {
                    writeFile file: '/tmp/vault_password.txt', text: "${env.VAULT_PASSWORD}"
                    sh '''
                    ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --vault-password-file /tmp/vault_password.txt
                    '''
                }
            }
        }
    }
}
