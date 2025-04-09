using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JayMedia.Data.Migrations
{
    /// <inheritdoc />
    public partial class SecondMigr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Searches",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "TimeStamp",
                table: "Searches",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Searches");

            migrationBuilder.DropColumn(
                name: "TimeStamp",
                table: "Searches");
        }
    }
}
