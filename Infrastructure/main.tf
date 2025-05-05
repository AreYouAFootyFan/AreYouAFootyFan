provider "aws" {
  region = var.aws_region
}

resource "aws_iam_role" "ec2_ssm_secrets" {
  name = "${var.project_name}-ec2-ssm-secrets-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2_ssm_secrets.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "secretsmanager" {
  role       = aws_iam_role.ec2_ssm_secrets.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

resource "aws_iam_instance_profile" "ec2_ssm_secrets" {
  name = "${var.project_name}-ec2-ssm-secrets-profile"
  role = aws_iam_role.ec2_ssm_secrets.name
}

module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
  vpc_cidr     = var.vpc_cidr
  aws_region   = var.aws_region
}

module "ec2" {
  source         = "./modules/ec2"
  project_name   = var.project_name
  subnet_id      = module.vpc.public_subnet_id
  instance_count = var.ec2_instance_count
  aws_region     = var.aws_region
  security_group_id = module.vpc.default_security_group_id
  iam_instance_profile = aws_iam_instance_profile.ec2_ssm_secrets.name
}

module "rds" {
  source                 = "./modules/rds"
  project_name           = var.project_name
  subnet_ids             = module.vpc.private_subnet_ids
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  aws_region             = var.aws_region
  enabled                = var.rds_enabled
  db_password            = var.db_password
  db_username            = var.db_username
  db_name                = var.db_name
}