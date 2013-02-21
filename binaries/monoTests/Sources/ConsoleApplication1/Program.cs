using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication1
{
    using System.IO;

    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 1)
            {
                int count = args[0].ToArray().Where(x => char.IsLetter(x)).Count();
                Console.WriteLine(count);
            }
            else
            {
                
                Console.WriteLine(string.Format("Usage: {0} $text$", Path.GetFileName(Environment.GetCommandLineArgs()[0])));                
            }

            //Console.ReadKey();
        }
    }
}
