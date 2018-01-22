module.exports = {
  NODE_ENV: '"production"',
  //BACKEND: '"https://api-eadms-k8s-local-3jbb00-1671950485.eu-west-1.elb.amazonaws.com/api/v1/proxy/namespaces/default/services/dash-dashboard:8080"',
  //BACKEND: '"http://localhost:4000"',
  BACKEND: '"http://localhost/api/v1/proxy/namespaces/default/services/dash-dashboard:8080"',
  ROOT: "/api/v1/proxy/namespaces/default/services/dash-dashboard:8080"
}
