package com.eventhub.models;

import java.sql.Timestamp;

public class Registration {
    private int id;
    private String eventId;
    private String fullName;
    private String email;
    private String phone;
    private String organization;
    private int tickets;
    private Timestamp registrationDate;

    public Registration() {}

    public Registration(String eventId, String fullName, String email, String phone, String organization, int tickets) {
        this.eventId = eventId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.organization = organization;
        this.tickets = tickets;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public int getTickets() {
        return tickets;
    }

    public void setTickets(int tickets) {
        this.tickets = tickets;
    }

    public Timestamp getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Timestamp registrationDate) {
        this.registrationDate = registrationDate;
    }
}