#!/usr/bin/env bash
set -e
ZIP=hotspot-mikrotik-system.zip
rm -f $ZIP
zip -r $ZIP backend frontend sql scripts README.txt
echo "Created $ZIP"
