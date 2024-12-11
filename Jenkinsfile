pipeline {
    environment {
        backend = 'backend'  // Backend Docker image name
        frontend = 'frontend'  // Frontend Docker image name
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

        // Build Docker image for the backend
        stage('Build Backend Docker Image') {
            steps {
                echo 'Building Backend Docker image...'
                script {
                    // Build Backend Docker Image
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

        // Deploy Backend to Kubernetes
        stage('Deploy Backend to Kubernetes') {
            steps {
                echo 'Deploying Backend to Kubernetes...'
                script {
                    // Apply backend Kubernetes manifest
                    sh 'kubectl apply -f k8s/deployment/backend-deployment.yml'
                    
                    // Rollout status for backend deployment
                    sh 'kubectl rollout status deployment/backend-deployment'
                }
            }
        }

        // Get Backend NodePort
        stage('Get Backend NodePort') {
            steps {
                script {
                    // Get the backend service NodePort
                    def backendNodePort = sh(script: "kubectl get svc backend-service -o=jsonpath='{.spec.ports[0].nodePort}'", returnStdout: true).trim()
                    echo "Backend NodePort: ${backendNodePort}"

                    // Create a ConfigMap for frontend with the backend URL
                    def backendUrl = "http://${env.MINIKUBE_IP}:${backendNodePort}"
                    echo "Setting frontend ConfigMap with backend URL: ${backendUrl}"
                    sh """
                    kubectl create configmap frontend-config --from-literal=REACT_APP_BACKEND_URL=${backendUrl} --dry-run=client -o yaml | kubectl apply -f -
                    """
                }
            }
        }

        // Build Docker image for the frontend and pass backend URL at build time
        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building Frontend Docker image...'
                script {
                    // Build Frontend Docker Image with the backend URL passed as an argument
                    frontend_image = docker.build("aasmaan1/frontend:latest", 
                        "--build-arg REACT_APP_BACKEND_URL=http://${env.MINIKUBE_IP}:${backendNodePort} ./frontend")
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

        // Deploy Frontend to Kubernetes using the updated backend URL
        stage('Deploy Frontend to Kubernetes') {
            steps {
                echo 'Deploying Frontend to Kubernetes...'
                script {
                    // Apply frontend Kubernetes manifest
                    sh 'kubectl apply -f k8s/deployment/frontend-deployment.yml'
                    
                    // Rollout status for frontend deployment
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
