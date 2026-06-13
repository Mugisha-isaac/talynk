# UML Diagrams - AI-Powered Talent Discovery Platform

## 3.5.1 Use Case Diagram

```mermaid
graph TB
    Creator["👤 Creator"]
    Audience["👥 Audience Member"]
    Admin["⚙️ Administrator"]
    System["🤖 System"]

    Creator -->|Upload Content| UC1["Upload Content"]
    Creator -->|View Dashboard| UC2["View Visibility Dashboard"]
    Creator -->|Track Metrics| UC3["Track Analytics"]
    
    Audience -->|Discover Content| UC4["Discover Content"]
    Audience -->|Follow Creator| UC5["Follow Creator"]
    Audience -->|Rate/Engage| UC6["Rate/Engage Content"]
    
    Admin -->|Manage Users| UC7["Manage User Accounts"]
    Admin -->|View Logs| UC8["View System Logs"]
    
    UC1 --> System
    UC2 --> System
    UC3 --> System
    UC4 --> System
    UC5 --> System
    UC6 --> System
    UC7 --> System
    UC8 --> System
    
    System -->|Assess Quality| UC9["Assess Content Quality"]
    System -->|Generate Recommendations| UC10["Generate Recommendations"]
    System -->|Apply Fairness| UC11["Apply Fairness Constraints"]
    
    style Creator fill:#e1f5ff
    style Audience fill:#e1f5ff
    style Admin fill:#e1f5ff
    style System fill:#fff3e0
    style UC9 fill:#f3e5f5
    style UC10 fill:#f3e5f5
    style UC11 fill:#f3e5f5
```

## 3.5.2 Class Diagram

```mermaid
classDiagram
    class User {
        -userId: String
        -email: String
        -username: String
        -createdAt: DateTime
        -profilePicture: String
        +register()
        +login()
        +updateProfile()
    }
    
    class Creator {
        -bio: String
        -discipline: String
        -visibilityScore: Float
        -followerCount: Int
        +uploadContent()
        +viewDashboard()
        +getAnalytics()
    }
    
    class AudienceMember {
        -preferences: List~String~
        -followingList: List~Creator~
        +discoverContent()
        +followCreator()
        +rateContent()
    }
    
    class ContentItem {
        -contentId: String
        -creatorId: String
        -title: String
        -description: String
        -uploadDate: DateTime
        -mediaUrl: String
        -discipline: String
    }
    
    class AudioContent {
        -duration: Int
        -format: String
        -bitrate: Int
    }
    
    class VideoContent {
        -resolution: String
        -duration: Int
        -format: String
    }
    
    class ImageContent {
        -format: String
        -resolution: String
        -dimensions: String
    }
    
    class QualityAssessmentModel {
        -modelId: String
        -version: String
        -architecture: String
        +assessQuality()
        +extractFeatures()
        +scoreContent()
    }
    
    class QualityScore {
        -scoreId: String
        -contentId: String
        -technicalQuality: Float
        -structuralCoherence: Float
        -originality: Float
        -genreAppropriateness: Float
        -accessibility: Float
        -overallScore: Float
        +calculateScore()
    }
    
    class RecommendationEngine {
        -engineId: String
        -model: String
        -version: String
        +generateRecommendations()
        +applyFairnessConstraints()
        +rankContent()
    }
    
    class VisibilityScore {
        -scoreId: String
        -creatorId: String
        -engagementScore: Float
        -qualityScore: Float
        -fairnessAdjustment: Float
        -finalScore: Float
        +calculateVisibility()
        +applyFairness()
    }
    
    class Interaction {
        -interactionId: String
        -userId: String
        -contentId: String
        -type: String
        -timestamp: DateTime
        -sessionDuration: Int
    }
    
    class AnalyticsDashboard {
        -dashboardId: String
        -creatorId: String
        +generateReports()
        +displayMetrics()
        +showTrends()
    }

    User <|-- Creator
    User <|-- AudienceMember
    ContentItem <|-- AudioContent
    ContentItem <|-- VideoContent
    ContentItem <|-- ImageContent
    
    Creator "1" --> "*" ContentItem : uploads
    AudienceMember "1" --> "*" Interaction : generates
    ContentItem "1" --> "1" QualityScore : has
    Creator "1" --> "1" VisibilityScore : owns
    RecommendationEngine "1" --> "*" ContentItem : recommends
    AnalyticsDashboard "1" --> "1" Creator : belongs_to
    QualityAssessmentModel "1" --> "*" QualityScore : produces
    
    style User fill:#e3f2fd
    style Creator fill:#c8e6c9
    style AudienceMember fill:#c8e6c9
    style ContentItem fill:#fff9c4
    style AudioContent fill:#ffe0b2
    style VideoContent fill:#ffe0b2
    style ImageContent fill:#ffe0b2
    style QualityAssessmentModel fill:#f8bbd0
    style RecommendationEngine fill:#f8bbd0
    style VisibilityScore fill:#b2dfdb
    style AnalyticsDashboard fill:#d1c4e9
```

## 3.5.3 Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ CONTENT_ITEM : uploads
    USER ||--o{ INTERACTION : generates
    USER ||--o{ RECOMMENDATION : receives
    CONTENT_ITEM ||--|| QUALITY_SCORE : has
    CONTENT_ITEM ||--o{ INTERACTION : receives
    CONTENT_ITEM ||--o{ RECOMMENDATION : recommended_in
    QUALITY_SCORE ||--|| CONTENT_ITEM : assesses
    RECOMMENDATION ||--|| USER : for
    RECOMMENDATION ||--|| CONTENT_ITEM : recommends
    USER ||--|| VISIBILITY_SCORE : has
    INTERACTION ||--|| CONTENT_ITEM : on

    USER {
        string userId PK
        string email
        string username
        string userType "Creator or Audience"
        datetime createdAt
        string profilePicture
    }

    CONTENT_ITEM {
        string contentId PK
        string creatorId FK
        string title
        string description
        datetime uploadDate
        string mediaUrl
        string discipline
        string contentType "Audio, Video, Image"
    }

    QUALITY_SCORE {
        string scoreId PK
        string contentId FK
        float technicalQuality
        float structuralCoherence
        float originality
        float genreAppropriateness
        float accessibility
        float overallScore
    }

    INTERACTION {
        string interactionId PK
        string userId FK
        string contentId FK
        string interactionType "view, like, share"
        datetime timestamp
        int sessionDuration
    }

    RECOMMENDATION {
        string recommendationId PK
        string userId FK
        string contentId FK
        float score
        int rankPosition
        datetime generatedAt
        string algorithm "hybrid_cf_cbf"
    }

    VISIBILITY_SCORE {
        string scoreId PK
        string creatorId FK
        float engagementScore
        float qualityScore
        float fairnessAdjustment
        float finalScore
        datetime calculatedAt
    }
```

## 3.5.4 Sequence Diagram - Content Recommendation Flow

```mermaid
sequenceDiagram
    participant AudienceMember as 👥 Audience Member
    participant Frontend as 🎨 React.js Frontend
    participant APIGateway as 🚪 Spring Boot API<br/>Gateway
    participant MLService as 🤖 FastAPI ML<br/>Service
    participant QualityCache as 💾 Quality Score<br/>Cache
    participant Database as 🗄️ PostgreSQL<br/>Database
    participant S3Store as ☁️ S3 Media<br/>Storage

    AudienceMember->>Frontend: 1. Request Discovery Feed
    Frontend->>APIGateway: 2. Send Authenticated Request<br/>(userId, session token)
    APIGateway->>MLService: 3. Call Recommendation<br/>Endpoint (userId)
    
    MLService->>Database: 4. Retrieve User<br/>Interaction History
    Database-->>MLService: Return interactions
    
    MLService->>QualityCache: 5. Retrieve Content<br/>Quality Scores
    QualityCache-->>MLService: Return cached scores
    
    MLService->>MLService: 6. Generate Candidate<br/>Recommendations<br/>(Hybrid CF+CBF)
    
    MLService->>MLService: 7. Apply Fairness<br/>Re-ranking Layer
    
    MLService-->>APIGateway: 8. Return Ranked<br/>Recommendations<br/>[contentId, score]
    
    APIGateway->>Database: 9. Fetch Content<br/>Metadata & Creator Info
    Database-->>APIGateway: Return metadata
    
    APIGateway->>S3Store: 10. Fetch Media<br/>Thumbnails/Previews
    S3Store-->>APIGateway: Return media URLs
    
    APIGateway-->>Frontend: 11. Return Formatted<br/>Recommendation Response
    
    Frontend->>Frontend: 12. Render Discovery<br/>Feed UI
    Frontend-->>AudienceMember: 13. Display Personalized<br/>Content Cards

    Note over MLService: Quality Assessment & Fairness<br/>Constraints Applied Here
    Note over Database: Stores all interactions<br/>and recommendation logs
```

## 3.5.5 Content Upload and Quality Assessment Flow

```mermaid
sequenceDiagram
    participant Creator as 👤 Creator
    participant Frontend as 🎨 React.js Frontend
    participant APIGateway as 🚪 Spring Boot API<br/>Gateway
    participant S3Store as ☁️ S3 Media<br/>Storage
    participant MLService as 🤖 FastAPI ML<br/>Service
    participant QualityModel as 🧠 Quality<br/>Assessment Model
    participant Database as 🗄️ PostgreSQL

    Creator->>Frontend: 1. Upload Content<br/>(file + metadata)
    Frontend->>APIGateway: 2. Send Upload Request<br/>(JWT authenticated)
    
    APIGateway->>S3Store: 3. Upload Media File<br/>(audio/video/image)
    S3Store-->>APIGateway: Return media URL
    
    APIGateway->>Database: 4. Create Content<br/>Item Record
    Database-->>APIGateway: Return contentId
    
    APIGateway->>MLService: 5. Queue Quality<br/>Assessment Job
    
    MLService->>S3Store: 6. Download Media<br/>for Analysis
    S3Store-->>MLService: Return media stream
    
    MLService->>QualityModel: 7. Extract Features<br/>(audio specs, visual<br/>characteristics)
    QualityModel-->>MLService: Return feature vector
    
    MLService->>QualityModel: 8. Score Content<br/>Quality Dimensions
    QualityModel-->>MLService: Return quality scores
    
    MLService->>Database: 9. Store Quality<br/>Scores
    Database-->>MLService: Confirm storage
    
    MLService-->>APIGateway: 10. Return Quality<br/>Assessment Complete
    
    APIGateway-->>Frontend: 11. Notify Quality<br/>Assessment Results
    
    Frontend-->>Creator: 12. Display Quality<br/>Report + Visibility<br/>Projection

    Note over QualityModel: Assesses:<br/>- Technical Quality<br/>- Coherence<br/>- Originality<br/>- Genre Fit<br/>- Accessibility
```

## 3.5.6 System Architecture Layers

```mermaid
graph TB
    subgraph "Frontend Layer"
        WEB["React.js Web Application"]
        CREATOR["Creator Dashboard"]
        DISCOVER["Discovery Interface"]
        ANALYTICS["Analytics Dashboard"]
    end

    subgraph "Backend Layer"
        GATEWAY["Spring Boot API Gateway"]
        AUTH["JWT Authentication"]
        CONTENT["Content Service"]
        RECOM["Recommendation Service"]
        ANALYTICS_SVC["Analytics Service"]
    end

    subgraph "Machine Learning Layer"
        QUALITY["Content Quality Assessment<br/>(PyTorch CNN)"]
        COLLAB["Collaborative Filtering<br/>(Matrix Factorization)"]
        CONTENT_BASED["Content-Based Filtering"]
        FAIRNESS["Fairness Re-ranking<br/>(Demographic Parity)"]
    end

    subgraph "Data Layer"
        POSTGRES["PostgreSQL Database<br/>(User, Content, Metadata)"]
        CACHE["Redis Cache<br/>(Quality Scores)"]
        S3["S3 Object Store<br/>(Media Files)"]
    end

    WEB -->|HTTP/REST| GATEWAY
    CREATOR -->|HTTP/REST| GATEWAY
    DISCOVER -->|HTTP/REST| GATEWAY
    ANALYTICS -->|HTTP/REST| GATEWAY

    GATEWAY -->|Auth| AUTH
    GATEWAY -->|Crud| CONTENT
    GATEWAY -->|Query| RECOM
    GATEWAY -->|Aggregate| ANALYTICS_SVC

    RECOM -->|Score| QUALITY
    RECOM -->|Filter| COLLAB
    RECOM -->|Filter| CONTENT_BASED
    RECOM -->|Rank| FAIRNESS

    FAIRNESS -->|Read| POSTGRES
    QUALITY -->|Store| CACHE
    CONTENT -->|Read/Write| POSTGRES
    CONTENT -->|Store| S3
    COLLAB -->|Query| POSTGRES

    style WEB fill:#e3f2fd
    style GATEWAY fill:#fff3e0
    style QUALITY fill:#f3e5f5
    style FAIRNESS fill:#fce4ec
    style POSTGRES fill:#e0f2f1
    style S3 fill:#e0f2f1
```

---

## Diagram Legend

| Color | Component Type |
|-------|----------------|
| 🔵 Blue | User/Frontend Components |
| 🟠 Orange | Backend Services |
| 🟣 Purple | Machine Learning Components |
| 🟢 Green | Data Storage/Cache |

