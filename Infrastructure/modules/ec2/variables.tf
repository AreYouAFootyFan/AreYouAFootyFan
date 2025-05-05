variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID to launch the instance in"
  type        = string
}

variable "instance_count" {
  description = "Number of EC2 instances"
  type        = number
  default     = 1
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "security_group_id" {
  description = "Security group ID for the instance"
  type        = string
  default     = null
}