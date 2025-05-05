output "public_ip" {
  value = try(aws_instance.this[0].public_ip, null)
  description = "Public IP of the first EC2 instance (if any)"
}