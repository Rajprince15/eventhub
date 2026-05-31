package com.eventhub.servlets;

import com.eventhub.dao.EventDAO;
import com.eventhub.dao.RegistrationDAO;
import com.eventhub.models.Event;
import com.eventhub.models.Registration;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class RegisterServlet extends HttpServlet {
    private RegistrationDAO registrationDAO;
    private EventDAO eventDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        registrationDAO = new RegistrationDAO();
        eventDAO = new EventDAO();
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        try {
            // Read JSON from request body
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JsonObject jsonRequest = gson.fromJson(sb.toString(), JsonObject.class);

            // Extract registration data
            String eventId = jsonRequest.get("eventId").getAsString();
            String fullName = jsonRequest.get("fullName").getAsString();
            String email = jsonRequest.get("email").getAsString();
            String phone = jsonRequest.get("phone").getAsString();
            String organization = jsonRequest.get("org").getAsString();
            int tickets = jsonRequest.get("tickets").getAsInt();

            // Validate inputs
            if (fullName.trim().isEmpty() || email.trim().isEmpty() || phone.trim().isEmpty() || organization.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                JsonObject error = new JsonObject();
                error.addProperty("error", "All fields are required");
                PrintWriter out = response.getWriter();
                out.print(error.toString());
                out.flush();
                return;
            }

            // Check if event exists and has enough seats
            Event event = eventDAO.getEventById(eventId);
            if (event == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                JsonObject error = new JsonObject();
                error.addProperty("error", "Event not found");
                PrintWriter out = response.getWriter();
                out.print(error.toString());
                out.flush();
                return;
            }

            if (event.getSeats() < tickets) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                JsonObject error = new JsonObject();
                error.addProperty("error", "Not enough seats available");
                PrintWriter out = response.getWriter();
                out.print(error.toString());
                out.flush();
                return;
            }

            // Save registration
            Registration registration = new Registration(eventId, fullName, email, phone, organization, tickets);
            boolean saved = registrationDAO.saveRegistration(registration);

            if (saved) {
                // Update available seats
                eventDAO.updateSeats(eventId, event.getSeats() - tickets);

                response.setStatus(HttpServletResponse.SC_OK);
                JsonObject success = new JsonObject();
                success.addProperty("success", true);
                success.addProperty("message", "Registration successful");
                PrintWriter out = response.getWriter();
                out.print(success.toString());
                out.flush();
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                JsonObject error = new JsonObject();
                error.addProperty("error", "Failed to save registration");
                PrintWriter out = response.getWriter();
                out.print(error.toString());
                out.flush();
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject error = new JsonObject();
            error.addProperty("error", "Server error: " + e.getMessage());
            PrintWriter out = response.getWriter();
            out.print(error.toString());
            out.flush();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}