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
    # Update system and install dependencies
    apt-get update -y
    apt-get install -y nginx

    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt-get install -y nodejs git

    # Install PM2 globally
    npm install -g pm2

    # Create application directory
    mkdir -p /home/ubuntu/footy-api
    chown -R ubuntu:ubuntu /home/ubuntu/footy-api

    # Configure Nginx
    cat > /etc/nginx/sites-available/footy-app << 'EOL'
    server {
        listen 80;
        server_name _;

        # Backend API
        location /api {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Redirect all other traffic to GitHub Pages
        location / {
            return 301 https://${var.github_pages_url}$request_uri;
        }
    }
    EOL

    # Enable the site
    ln -sf /etc/nginx/sites-available/footy-app /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    systemctl restart nginx

    # Create deployment script
    cat > /home/ubuntu/deploy.sh << 'EOL'
    #!/bin/bash
    cd /home/ubuntu/footy-api
    git pull
    npm install
    npm run build
    pm2 restart all || pm2 start src/app.ts --name "footy-api"
    EOL

    chmod +x /home/ubuntu/deploy.sh
    chown ubuntu:ubuntu /home/ubuntu/deploy.sh

    echo "System ready for deployment. Use /home/ubuntu/deploy.sh to deploy updates." > /home/ubuntu/footy-api/DEPLOYMENT_STATUS.txt
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