gcloud compute instances create my-app-instance \
    --image=debian-8 \
    --machine-type=g1-small \
    --scopes userinfo-email,cloud-platform \
    --metadata-from-file startup-script=gce/startup-script.sh \
    --zone us-central1-f \
    --tags http-server