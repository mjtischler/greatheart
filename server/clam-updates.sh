# Create this file in /etc/cron.daily:
# sudo vi clam-updates.sh
# sudo chmod 755 clam-updates.sh

# Then open crontab with:
# crontab -e

# Add to the crontab file:
# SHELL=/bin/bash (add to the top)
# 0 0 * * * /etc/cron.daily/clam-updates.sh
# NOTE: Make sure your crontab ends in a newline

# Reopen the file with sudo:
# sudo vi clam-updates.sh
# Add these lines:
# #!/bin/bash
# sudo /etc/init.d/clamav-freshclam stop
# sudo freshclam
# sudo /etc/init.d/clamav-freshclam start

# NOTE: This must be run from a bash shell, not fish.
