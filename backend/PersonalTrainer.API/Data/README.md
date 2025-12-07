# Personal Trainer - SQL Scripts

SQL scripts for database setup.

## Files

**01_CreateTables.sql** - Creates Transformations table

## Usage

Execute the SQL script on SQL Server database to create the table structure.

## Table: Transformations

Stores client transformation success stories:
- Id, Name, Age
- Description, Story, Quote
- Image (optional)

## Service Implementation

Data access is handled through:
- **ITransformationService** (Services/Interfaces)
- **TransformationService** (Services/Implementations)

All CRUD operations are performed via SQL queries using Microsoft.Data.SqlClient.

Connection string configured in `appsettings.json` under "DefaultConnection".
