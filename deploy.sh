#!/bin/bash

NAMESPACE="customer-purchase-system"

echo "------ Applying Namespace... ------"
kubectl apply -f ./kubernetes-manifest/namespace.yaml
echo "------ Namespace applied. ------"

echo "------ Applying Zookeeper and MongoDB... ------"
kubectl apply -f ./kubernetes-manifest/zookeeper.yaml
kubectl apply -f ./kubernetes-manifest/mongo.yaml
echo " ------ Zookeeper and MongoDB applied. Waiting for them to be available... ------"
kubectl wait --for=condition=available --timeout=300s deployment/zookeeper -n $NAMESPACE &
kubectl wait --for=condition=ready --timeout=300s pod/mongo-0 -n $NAMESPACE &
wait
echo "------ Zookeeper and MongoDB are available. ------"

echo "------ Applying Kafka... ------"
kubectl apply -f ./kubernetes-manifest/kafka.yaml
echo "------ Kafka applied. Waiting for Kafka to be available... ------"
kubectl wait --for=condition=ready --timeout=300s pod/kafka-0 -n $NAMESPACE
sleep 300
echo "------ Kafka is available. ------"

echo "------ Applying Backend and Frontend... ------"
kubectl apply -f ./kubernetes-manifest/backend.yaml
kubectl apply -f ./kubernetes-manifest/frontend.yaml
echo "------ Backend and Frontend applied. Waiting for them to be available... ------"
kubectl wait --for=condition=available --timeout=300s deployment/backend -n $NAMESPACE &
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n $NAMESPACE &
wait
echo "------ Backend and Frontend are available. ------"

echo "------ All resources have been successfully applied and are available. ------"