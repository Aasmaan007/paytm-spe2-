pipeline {
    environment {
        backend = 'backend'  // Backend Docker image name
        frontend = 'frontend'  // Frontend Docker image name
        VAULT_PASSWORD = 'aasmaan' // Jenkins secret for the Ansible vault password
        KUBECONFIG = './k8s/kubectl-config' // Path to Kubernetes kubeconfig file
    }

    agent any

    stages {
        // Clone the repository
        stage('Clone Repository') {
            steps {
                echo 'Cloning the Git repository...'
                git branch: 'tests', url: 'https://github.com/Aasmaan007/paytm-spe2-.git'
            }
        }

        // Run tests for the backend
        stage('Testing') {
            steps {
                echo 'Running tests...'
                script {
                    dir('backend') {
                        // Install dependencies and run tests
                        sh 'npm install'
                        sh 'npm test'
                    }
                }
            }
        }

        // Build Docker images for backend and frontend
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                script {
                    // Build Backend Docker Image
                    backend_image = docker.build("aasmaan1/backend:latest", "./backend")
                    
                    // Build Frontend Docker Image
                    frontend_image = docker.build("aasmaan1/frontend:latest", "./frontend")
                }
            }
        }

        // Push Docker images to Docker Hub
        stage('Push Docker Images') {
            steps {
                echo 'Pushing Docker images to Docker Hub...'
                script {
                    docker.withRegistry('', 'DockerHubCred') {
                        backend_image.push()
                        frontend_image.push()
                    }
                }
            }
        }

        // Setup kubeconfig for Kubernetes access
        stage('Set up Kubernetes Config') {
            steps {
                echo 'Setting up Kubernetes configuration...'
                script {
                    sh 'mkdir -p $HOME/.kube'
                    sh "cp ${env.KUBECONFIG} $HOME/.kube/config"
                }
            }
        }

        // Deploy to Kubernetes using kubectl
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                script {
                    // Apply backend and frontend Kubernetes manifests
                    sh 'kubectl apply -f k8s/deployment/backend-deployment.yml'
                    sh 'kubectl apply -f k8s/deployment/frontend-deployment.yml'

                    // Rollout status for deployments
                    sh 'kubectl rollout status deployment/backend-deployment'
                    sh 'kubectl rollout status deployment/frontend-deployment'
                }
            }
        }

        // Post-deployment checks (Optional)
        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                script {
                    // Check the status of all pods
                    sh 'kubectl get pods'
                    // Optional: Check services
                    sh 'kubectl get services'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
