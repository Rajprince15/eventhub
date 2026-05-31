package com.eventhub.models;

public class Event {
    private String id;
    private String name;
    private String category;
    private String date;
    private String location;
    private int seats;
    private String icon;
    private String gradient;

    public Event() {}

    public Event(String id, String name, String category, String date, String location, int seats, String icon, String gradient) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.date = date;
        this.location = location;
        this.seats = seats;
        this.icon = icon;
        this.gradient = gradient;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getSeats() {
        return seats;
    }

    public void setSeats(int seats) {
        this.seats = seats;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getGradient() {
        return gradient;
    }

    public void setGradient(String gradient) {
        this.gradient = gradient;
    }
}