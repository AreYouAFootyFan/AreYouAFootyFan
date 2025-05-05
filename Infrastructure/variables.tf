# Backend variables
variable "backend_bucket" {
  description = "S3 bucket for Terraform state"
  type        = string
}

variable "backend_key" {
  description = "Path within the bucket for the state file"
  type        = string
  default     = "terraform.tfstate"
}

variable "backend_region" {
  description = "AWS region for the backend bucket"
  type        = string
  default     = "af-south-1"
}

# variable "backend_dynamodb_table" {
#   description = "DynamoDB table for state locking"
#   type        = string
# }

# General variables
variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "af-south-1"
}

# VPC module variables
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# EC2 module variables
variable "ec2_instance_count" {
  description = "Number of EC2 instances"
  type        = number
  default     = 1
}

# RDS module variables
variable "rds_enabled" {
  description = "Whether to create an RDS instance"
  type        = bool
  default     = true
}

variable "db_password" {
  description = "Password for the PostgreSQL master user. Set via tfvars or TF_VAR_db_password environment variable."
  type        = string
  sensitive   = true
}