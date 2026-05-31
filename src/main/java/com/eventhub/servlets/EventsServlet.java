package com.eventhub.servlets;

import com.eventhub.dao.EventDAO;
import com.eventhub.models.Event;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class EventsServlet extends HttpServlet {
    private EventDAO eventDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        eventDAO = new EventDAO();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        try {
            List<Event> events = eventDAO.getAllEvents();
            JsonArray jsonArray = new JsonArray();

            for (Event event : events) {
                JsonObject jsonEvent = new JsonObject();
                jsonEvent.addProperty("id", event.getId());
                jsonEvent.addProperty("name", event.getName());
                jsonEvent.addProperty("category", event.getCategory());
                jsonEvent.addProperty("date", event.getDate());
                jsonEvent.addProperty("location", event.getLocation());
                jsonEvent.addProperty("seats", event.getSeats());
                jsonEvent.addProperty("icon", event.getIcon());

                // Parse gradient JSON string
                JsonArray gradientArray = gson.fromJson(event.getGradient(), JsonArray.class);
                jsonEvent.add("gradient", gradientArray);

                jsonArray.add(jsonEvent);
            }

            PrintWriter out = response.getWriter();
            out.print(jsonArray.toString());
            out.flush();

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject error = new JsonObject();
            error.addProperty("error", "Failed to fetch events: " + e.getMessage());
            PrintWriter out = response.getWriter();
            out.print(error.toString());
            out.flush();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}