provider "aws" {
  endpoints {
    s3 = var.aws_s3_endpoint
  }
  region                      = var.aws_region
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  access_key                  = var.aws_access_key_id
  secret_key                  = var.aws_secret_access_key
}

resource "aws_s3_bucket" "localstack_bucket" {
  bucket = var.aws_s3_bucket_name
}
