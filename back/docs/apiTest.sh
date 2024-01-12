#!/bin/bash

# Host
HOST="http://localhost:3001"

# Create a new meeting
echo "-------- Creating a new meeting --------"
MEETING_RESPONSE=$(curl -s -X POST "$HOST/api/meetings/create" \
  -H "Content-Type: application/json" \
  -d "{\"coordinator\": {\"name\": \"John Doe\", \"email\": \"john@example.com\"}, \"meetingName\": \"Team Sync\", \"description\": \"Weekly team synchronization meeting\", \"proposedTimes\": [{\"start\": \"2024-01-30T09:00:00.000Z\", \"end\": \"2024-01-30T10:00:00.000Z\"}]}")
echo "Create meeting response: $MEETING_RESPONSE"

# Extract Meeting ID
MEETING_ID=$(echo $MEETING_RESPONSE | jq -r '.meeting._id')
echo "Meeting ID: $MEETING_ID"

# Check if Meeting ID is null
if [ "$MEETING_ID" == "null" ]; then
    echo "Error: Failed to create meeting. Exiting script."
    exit 1
fi

# Submit availability for a meeting
echo "-------- Submitting availability for a meeting --------"
AVAILABILITY_RESPONSE=$(curl -s -X POST "$HOST/api/availabilities/$MEETING_ID/availability" \
  -H "Content-Type: application/json" \
  -d "{\"participant\": {\"name\": \"Jane Smith\", \"email\": \"jane@example.com\"}, \"availableTimes\": [{\"start\": \"2024-01-30T09:00:00.000Z\", \"end\": \"2024-01-30T10:00:00.000Z\"}]}")
echo "Submit availability response: $AVAILABILITY_RESPONSE"

# Retrieve meeting details (including availabilities)
echo "-------- Retrieving meeting details --------"
MEETING_DETAILS=$(curl -s -X GET "$HOST/api/meetings/$MEETING_ID")
echo "Meeting details: $MEETING_DETAILS"
