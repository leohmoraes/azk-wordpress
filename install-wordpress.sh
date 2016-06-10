#!/bin/bash

echo "... downloading wordpress"
wget http://wordpress.org/latest.tar.gz
tar xfz latest.tar.gz

echo "... move wordpress files into place"
mv wordpress/wp-admin public/wp-admin
mv wordpress/wp-includes public/wp-includes
mv wordpress/*.php public/

echo "... cleanup"
rm -rf ./wordpress/
rm -f latest.tar.gz
