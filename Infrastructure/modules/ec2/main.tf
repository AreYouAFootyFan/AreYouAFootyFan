resource "aws_instance" "this" {
  count         = var.instance_count
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  subnet_id     = element(var.subnet_ids, count.index % length(var.subnet_ids))
  vpc_security_group_ids = [var.security_group_id]
  tags = {
    Name = "${var.project_name}-ec2-${count.index}"
  }
  user_data = <<-EOF
    #!/bin/bash
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt-get update -y
    apt-get install -y nodejs git
    npm install -g pm2
    mkdir -p /home/ubuntu/footy-api
    chown ubuntu:ubuntu /home/ubuntu/footy-api
    echo "Node.js, npm, and pm2 installed. Ready for API deployment." > /home/ubuntu/footy-api/DEPLOYMENT_STATUS.txt
  EOF
  iam_instance_profile = var.iam_instance_profile
  key_name = var.key_name
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-amd64-server-*"]
  }
}