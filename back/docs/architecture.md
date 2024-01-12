# SET-A-Meet ajsibley Backend Service Documentation

## Overview

This document provides an overview of the backend service for a meeting coordination application. The service facilitates the creation of meetings and the collection of participant availability without requiring user accounts.

## Architecture

### High-Level Architecture

```plantuml
@startuml
!define RECTANGLE class

RECTANGLE Client {
  +Request Meeting Creation
  +Submit Availability
  +View Availability
}

RECTANGLE Server {
  +Handle Requests
  +Provide Responses
}

RECTANGLE Database {
  +Store Meetings
  +Store Availabilities
}

Client --> Server : Uses
Server --> Database : Uses
@enduml
```

## Database Schema

Meeting Schema

```plantuml
@startuml
class Meeting {
  -String link (unique)
  -Object coordinator {name, email}
  -String meetingName
  -String description
  -Array proposedTimes [{start, end}]
  -Array availabilities [ObjectID]
  -Date createdAt
}
@enduml
```

Availability Schema

```plantuml
@startuml
class Availability {
  -ObjectID meeting
  -Object participant {name, email}
  -Array availableTimes [{start, end}]
  -Date createdAt
}
@enduml
```

## Server Structure

```plantuml
@startuml
package "Express Server" {
  [server.js] as Server
  package "Controllers" {
    [meetingControllers.js] as MeetingController
    [availabilityControllers.js] as AvailabilityController
  }
  package "Routes" {
    [meetingRoutes.js] as MeetingRoutes
    [availabilityRoutes.js] as AvailabilityRoutes
  }
  package "Models" {
    [Meeting.js] as MeetingModel
    [Availability.js] as AvailabilityModel
  }
}

Server -down-> MeetingRoutes : mounts
Server -down-> AvailabilityRoutes : mounts
MeetingRoutes -right-> MeetingController : uses
AvailabilityRoutes -left-> AvailabilityController : uses
MeetingController -down-> MeetingModel : interacts with
AvailabilityController -down-> AvailabilityModel : interacts with
@enduml
```

# API Endpoints

## Meeting Endpoints

- **`POST /api/meetings/create`**
        Creates a new meeting.
- **`GET /api/meetings/:link`**
        Retrieves a meeting by its unique link.

## Availability Endpoints

- **`POST /api/availabilities/:meetingId/availability`**
        Submits availability for a specific meeting.

# Functionality
## Meeting Creation

The coordinator can create a meeting by sending a POST request to `/api/meetings/create`. This endpoint will generate a unique meeting with a link that can be shared with participants.
## Submitting Availability

Participants follow the unique link to a form where they submit their availability. This creates an Availability entry in the database associated with the Meeting.
## Viewing Availability

The coordinator can view all submitted availabilities by accessing the meeting via its unique link, allowing them to coordinate the meeting time effectively.
