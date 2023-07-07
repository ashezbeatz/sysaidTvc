#!/bin/bash

# Fixed values for service name and description
service_name="warcompareservice"
description="WAR COMPARE Service"

# Get the current working directory
current_directory=$(pwd)

# Specify the environment file name
env_file=".env"

# Create the environment file path using the current directory and file name
env_file_path="${current_directory}/${env_file}"

# Generate the service unit file content
unit_file_content="[Unit]
Description=${description}
After=network.target

[Service]
EnvironmentFile=${env_file_path}
ExecStart=${current_directory}/warfilescheckers.sh

[Install]
WantedBy=default.target"

# Create the service unit file
echo "${unit_file_content}" | sudo tee "/etc/systemd/system/${service_name}.service" > /dev/null

# Reload the systemd daemon and enable/start the service
sudo systemctl daemon-reload
sudo systemctl enable "${service_name}.service"
#sudo systemctl start "${service_name}.service"