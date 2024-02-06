variable "aws_access_key_id" {
  type    = string
  default = "dummy-access-key"
}

variable "aws_secret_access_key" {
  type    = string
  default = "dummy-secret-access-key"
}

variable "aws_s3_bucket_name" {
  type    = string
  default = "boomershub-bucket"
}

variable "aws_s3_endpoint" {
  type    = string
  default = "http://s3.localhost.localstack.cloud:4566"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}
